export function sanitizeNextPath(nextPath: string | null | undefined): string {
  if (!nextPath) {
    return '/app';
  }

  if (!nextPath.startsWith('/')) {
    return '/app';
  }

  if (nextPath.startsWith('//')) {
    return '/app';
  }

  return nextPath;
}

