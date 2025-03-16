import React, { ReactNode } from "react";
import CodeBlock from "./code-block";

type MarkdownComponentProps = {
	children: ReactNode;
	className?: string;
	href?: string;
	inline?: boolean;
};

const markdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
	code({ inline, className, children, ...props }) {
		const match = /language-(\w+)/.exec(className || "");
		if (!inline && match) {
			return <CodeBlock language={match[1]} value={String(children).trim()} {...props} />;
		}
		return (
			<code
				className="bg-gray-100 dark:bg-gray-800 px-1 text-sm font-mono rounded"
				{...props}
			>
				{children}
			</code>
		);
	},
	p: ({ children }) => <p className="mb-1">{children}</p>,
	ul: ({ children }) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
	li: ({ children }) => <li className="mb-0.5">{children}</li>,
	h1: ({ children }) => <h1 className="text-xl font-medium mt-3 mb-1">{children}</h1>,
	h2: ({ children }) => <h2 className="text-lg font-medium mt-2 mb-1">{children}</h2>,
	h3: ({ children }) => <h3 className="text-base font-medium mt-1.5 mb-0.5 ">{children}</h3>,
	a: ({ children, href }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-blue-500 hover:underline"
		>
			{children}
		</a>
	),
	table: ({ children }) => (
		<div className="overflow-x-auto my-1">
			<table className="w-full border-collapse text-sm">
				{children}
			</table>
		</div>
	),
	th: ({ children }) => (
		<th className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-left font-medium border border-gray-200 dark:border-gray-700">{children}</th>
	),
	td: ({ children }) => (
		<td className="px-1.5 py-0.5 border border-gray-200 dark:border-gray-700">{children}</td>
	),
};

export default markdownComponents;