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
				className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
				{...props}
			>
				{children}
			</code>
		);
	},
	p: ({ children }) => <p className="mb-2">{children}</p>,
	ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal ml-4">{children}</ol>,
	li: ({ children }) => <li className="mb-1">{children}</li>,
	h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
	h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
	h3: ({ children }) => <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>,
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
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
				{children}
			</table>
		</div>
	),
	th: ({ children }) => (
		<th className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-left font-semibold">{children}</th>
	),
	td: ({ children }) => (
		<td className="px-3 py-2 border border-gray-300 dark:border-gray-700">{children}</td>
	),
};

export default markdownComponents;
