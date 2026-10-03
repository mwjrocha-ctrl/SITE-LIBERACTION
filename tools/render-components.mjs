// Keep the existing custom elements editable, but publish their content in HTML.
// Re-render from attributes on every build so repeat builds cannot retain stale copy.
export function renderComponents(html) {
  for (const name of ['inner-hero', 'page-cta', 'legal-page']) {
    const template = html.match(new RegExp(`<template id="${name}-template">([\\s\\S]*?)</template>`))?.[1];
    if (!template) continue;
    html = html.replace(new RegExp(`<${name}\\b([^>]*)>[\\s\\S]*?</${name}>`, 'g'), (_, attributes) => {
      const content = template.replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-(title|body)=""[^>]*>)[\s\S]*?<\/\2>/g, (_, opening, tag, field) => {
        const fallback = name === 'page-cta' && field === 'body' ? 'Atendimento individual e confidencial.' : '';
        const value = attributes.match(new RegExp(`\\b${field}="([^"]*)"`))?.[1] || fallback;
        return `${opening}${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
      });
      return `<${name}${attributes}>${content}</${name}>`;
    });
  }
  return html;
}
