import { ComingSoon } from '@/components/coming-soon';

export default function ServicePage({ params }: { params: { slug: string } }) {
  return <ComingSoon title={`${params.slug} Service`} />;
}
