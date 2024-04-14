const originalRequireResolve = require.resolve;

function requireResolvePolyfill(
  request: string,
  options?: { paths?: string[] },
) {
  console.log('require resolve polyfill called?');
  if (options?.paths) {
    return Bun.resolveSync(request, options.paths[0]);
  }

  return originalRequireResolve(request);
}

requireResolvePolyfill.paths = originalRequireResolve.paths;

require.resolve = requireResolvePolyfill;
