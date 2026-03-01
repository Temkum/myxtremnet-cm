import { ComingSoon } from '@/components/coming-soon';

export default function PackagePage({ params }: { params: { slug: string } }) {
  return <ComingSoon title={`${params.slug} Package`} />;
}
