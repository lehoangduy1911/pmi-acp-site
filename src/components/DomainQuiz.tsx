import React, {useEffect, useMemo, useState} from 'react';
import QuizBlock, {QuizItem} from './QuizBlock';

type DomainKey = 'Mindset' | 'Leadership' | 'Product' | 'Delivery';
type Lang = 'vi' | 'en';

type Props = {
  domain: DomainKey;
  lang: Lang;
  count?: number;
  sourceUrl?: string; // defaults to '/mock/Questions.json'
};

type BankItem = {
  id: string;
  topic: string;
  questionEN: string;
  questionVI: string;
  aEN: string; aVI: string;
  bEN: string; bVI: string;
  cEN: string; cVI: string;
  dEN: string; dVI: string;
  correct: 'A'|'B'|'C'|'D';
  explanationEN?: string;
  explanationVI?: string;
  difficulty?: string;
};

const topicMap: Record<DomainKey, string[]> = {
  Mindset: ['Agile Mindset','Agile Principles and Mindset','Agile Values & Principles','Principles and Mindset'],
  Leadership: ['Servant Leadership','Team Empowerment & Collaboration','Team Performance','Stakeholder Engagement','Facilitation & Coaching Mindset'],
  Product: ['Value Delivery & Customer Focus','Value-Driven Delivery','Value-driven Delivery','Adaptive Planning'],
  Delivery: ['Problem Detection & Resolution','Problem Detection and Resolution','Metrics and Reporting','Risk Management (Agile)','Continuous Improvement','Continuous Improvement (Organizational)','Continuous Improvement (Process)','Continuous Improvement (Product)','Adapting to Change & Continuous Improvement'],
};

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function toQuizItems(bank: BankItem[], lang: Lang): QuizItem[] {
  return bank.map((q) => {
    const opts = lang === 'vi' ? [q.aVI, q.bVI, q.cVI, q.dVI] : [q.aEN, q.bEN, q.cEN, q.dEN];
    const stem = lang === 'vi' ? q.questionVI : q.questionEN;
    const rationale = lang === 'vi' ? q.explanationVI : q.explanationEN;
    const answerIndex = {A:0, B:1, C:2, D:3}[q.correct];
    return { id: q.id, stem, options: opts, answerIndex, rationale };
  });
}

export default function DomainQuiz({ domain, lang, count = 10, sourceUrl = '/mock/Questions.json' }: Props) {
  const [data, setData] = useState<BankItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const topics = topicMap[domain];

  useEffect(() => {
    let active = true;
    fetch(sourceUrl).then(r => {
      if (!r.ok) throw new Error('Failed to load Questions.json');
      return r.json();
    }).then((all: BankItem[]) => {
      if (!active) return;
      const filtered = all.filter(q => topics.includes(q.topic));
      setData(filtered);
    }).catch(e => setError(e.message));
    return () => { active = false; };
  }, [sourceUrl, domain]);

  if (error) return <div className="alert alert--danger">Lỗi tải dữ liệu: {error}</div>;
  if (!data) return <div className="alert alert--secondary">Đang tải câu hỏi…</div>;
  if (data.length === 0) return <div className="alert alert--warning">Chưa có câu hỏi cho domain này.</div>;

  const items = toQuizItems(pick(data, Math.min(count, data.length)), lang);
  return <QuizBlock items={items} />;
}
