/**
 *
 * Use these instead of next/navigation and next/link throughout the app.
 * They automatically prepend the active locale to all hrefs.
 *
 * Usage:
 *   import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
