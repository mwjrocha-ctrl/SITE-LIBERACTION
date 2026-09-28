$ErrorActionPreference = 'Stop'
$siteRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 8080)
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
    '.js' = 'text/javascript; charset=utf-8'; '.json' = 'application/json'
    '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.ico' = 'image/x-icon'
    '.txt' = 'text/plain; charset=utf-8'; '.xml' = 'application/xml'
    '.woff' = 'font/woff'; '.woff2' = 'font/woff2'; '.avif' = 'image/avif'
}
Write-Output 'Starting local server'
try {
    $listener.Start()
    Write-Output 'Local server ready: http://localhost:8080'
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 3000
            $client.SendTimeout = 3000
            $stream = $client.GetStream()
            $reader = [IO.StreamReader]::new($stream)
            $request = $reader.ReadLine()
            if (-not $request) { continue }
            while ($reader.ReadLine()) { }
            $method, $target = $request.Split(' ')[0, 1]
            $urlPath = [Uri]::UnescapeDataString(($target -split '\?', 2)[0])
            $relative = $urlPath.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            $file = [IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
            $status = '200 OK'
            $extraHeaders = ''
            $contentType = 'text/plain; charset=utf-8'
            $body = [byte[]]@()
            if (($file -ne $siteRoot -and -not $file.StartsWith($siteRoot + '\', [StringComparison]::OrdinalIgnoreCase)) -or $relative -match '(^|[\\/])\.') {
                $status = '403 Forbidden'
            } elseif ($method -notin @('GET', 'HEAD')) {
                $status = '405 Method Not Allowed'
            } else {
                if (Test-Path -LiteralPath $file -PathType Container) {
                    if (-not $urlPath.EndsWith('/')) {
                        $status = '301 Moved Permanently'
                        $extraHeaders = "Location: $($target.Split('?')[0])/`r`n"
                    }
                    $file = Join-Path $file 'index.html'
                }
                if (Test-Path -LiteralPath $file -PathType Leaf) {
                    $body = [IO.File]::ReadAllBytes($file)
                    $extension = [IO.Path]::GetExtension($file).ToLowerInvariant()
                    if ($mimeTypes.ContainsKey($extension)) { $contentType = $mimeTypes[$extension] }
                    else { $contentType = 'application/octet-stream' }
                } else { $status = '404 Not Found' }
            }
            $headers = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`n${extraHeaders}Cache-Control: no-store`r`nConnection: close`r`n`r`n")
            $stream.Write($headers, 0, $headers.Length)
            if ($method -ne 'HEAD') { $stream.Write($body, 0, $body.Length) }
        } catch { Write-Warning $_.Exception.Message }
        finally { $client.Dispose() }
    }
} finally { $listener.Stop() }
