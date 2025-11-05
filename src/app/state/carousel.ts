import { Injectable, signal } from '@angular/core';

interface Section {
  id: string;
  title: string;
  icon: string;
  content: string;
  details?: string[];
}

@Injectable({ providedIn: 'root' })
export class CarouselStore {
  public readonly activeIndex = signal(0);

  public readonly sections: Section[] = [
    {
      id: 'about',
      title: 'About',
      icon: 'person',
      content: 'About Me',
      details: [
        'Senior full-stack engineer with 8 years building enterprise software from 0→1, currently leading AI strategy and innovation initiatives. Deep expertise in cloud-native architecture (AWS serverless), TypeScript/Node.js ecosystem, and LLM-powered solutions. Transitioned team from feature-factory to outcome-driven product development while scaling from being a sole IC to managing 15+ developers and designers.',
      ],
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      icon: 'code',
      content: 'Technical Skills',
      details: [
        '<strong>Languages & Frameworks:</strong> TypeScript/JavaScript, Node.js, Angular, Python, GraphQL, SQL, Java, C/C++',
        '<strong>Cloud & Infrastructure:</strong> AWS serverless (Lambda, DynamoDB, RDS, AppSync, Cognito, S3, CloudFront), infrastructure-as-code (AWS CDK), CI/CD pipelines, multi-tenant SaaS architecture',
        '<strong>AI/ML:</strong> Amazon Bedrock, Microsoft 365 Agents SDK, LangGraph, RAG, MCP, context engineering',
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'mail',
      content: 'Get In Touch',
      details: [
        ['LinkedIn', 'https://www.linkedin.com/in/sander-altman'],
        ['GitHub', 'https://github.com/saltman424'],
        ['Website', 'https://saltman424.github.io'],
      ].map(
        ([label, url]) =>
          `<strong>${label}:</strong> <a target="_blank" rel="noopener noreferrer" href="${url}">${url.replace(/^https?:\/\/(www.)?/, '')}</a>`,
      ),
    },
  ];

  public goto(index: number): void {
    this.activeIndex.set(index);
  }

  public next(): void {
    this.activeIndex.update((activeIndex) => (activeIndex + 1) % this.sections.length);
  }

  public previous(): void {
    this.activeIndex.update(
      (activeIndex) => (activeIndex - 1 + this.sections.length) % this.sections.length,
    );
  }
}
