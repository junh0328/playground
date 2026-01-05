'use client';

interface DemoSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export default function DemoSection({
  id,
  title,
  subtitle,
  description,
  children,
}: DemoSectionProps) {
  return (
    <section id={id} className='scroll-mt-20'>
      {/* 섹션 헤더 */}
      <div className='mb-6'>
        <div className='flex items-baseline gap-3'>
          <h2 className='text-2xl font-bold text-zinc-100'>{title}</h2>
          {subtitle && (
            <span className='text-sm text-zinc-500'>{subtitle}</span>
          )}
        </div>
        {description && (
          <div className='mt-2 text-zinc-400 leading-relaxed'>{description}</div>
        )}
      </div>

      {/* 섹션 컨텐츠 */}
      <div className='space-y-8'>{children}</div>
    </section>
  );
}
