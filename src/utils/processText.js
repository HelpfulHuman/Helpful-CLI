import nunjucks from "nunjucks";

/**
 * Uses the given context object to process a string of
 * text using Nunjuck's renderer.
 *
 * @param  {Object} ctx
 * @param  {String} template
 * @return {String}
 */
export default function (ctx, template) {
  return nunjucks.renderString(template, ctx.input);
}