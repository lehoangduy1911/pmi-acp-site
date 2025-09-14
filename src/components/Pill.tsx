import React from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'secondary' | 'neutral';

type PillProps = {
  children: React.ReactNode;
  tone?: Tone;
};

const toneClass: Record<Tone, string> = {
  primary: 'badge badge--primary',
  success: 'badge badge--success',
  warning: 'badge badge--warning',
  secondary: 'badge badge--secondary',
  neutral: 'badge',
};

export default function Pill({ children, tone = 'neutral' }: PillProps) {
  return <span className={toneClass[tone]}>{children}</span>;
}
