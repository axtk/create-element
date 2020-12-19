import escapeRegExp from 'escape-string-regexp';
import escapeHTML from 'escape-html';

export default (s, data = {}) => {
    if (!s) return s;

    if (window.Handlebars)
        return window.Handlebars.compile(s)(data);

    for (let [k, v] of Object.entries(data))
        s = s.replace(
            new RegExp(`\\$\\{${escapeRegExp(String(k))}\\}`, 'g'),
            escapeHTML(v),
        );

    return s;
};
