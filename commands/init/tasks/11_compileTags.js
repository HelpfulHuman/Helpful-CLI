function isFrontend (input) {
  return (
    input.projectType === 'site' ||
    (input.projectType === 'app' && input.frontend) ||
    (input.projectType === 'lib' && input.libType === 'frontend')
  );
}

function isNode (input) {
  return (
    (input.backend) ||
    (input.projectType === 'lib' && input.libType === 'node')
  );
}

/**
 * Compiles a list of tags that can be used to more easily identify traits of
 * the generated project.
 */
module.exports = function (input, done) {
  const frontend = isFrontend(input);
  const node = isNode(input);

  input.tags = {
    frontend: frontend,
    server: !!input.backend,
    node: node,
    javascript: (node || frontend),
    html: (frontend && input.projectType !== 'lib'),
    css: (frontend && input.projectType !== 'lib')
  };

  done();
}