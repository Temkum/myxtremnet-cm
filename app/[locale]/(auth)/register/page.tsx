import { RedirectType } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/access-denied', RedirectType.replace);
}
