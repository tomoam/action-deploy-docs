import type { Transformer } from "unified";
import { YamlNode } from "remark-frontmatter";

import yaml from "js-yaml";
import Message from "vfile-message";
import visit from "unist-util-visit";

export function link_renderer(
	href: string,
	title: string,
	text: string
): string {
	let target_attr = "";
	let title_attr = "";

	if (href.startsWith("http")) {
		target_attr = ' target="_blank"';
	}

	if (title !== null) {
		title_attr = ` title="${title}"`;
	}

	return `<a href="${href}"${target_attr}${title_attr} rel="noopener noreferrer">${text}</a>`;
}

export function parse_frontmatter(): Transformer {
	return function transformer(tree, vFile) {
		visit(tree, "yaml", (node: YamlNode) => {
			try {
				const data = yaml.load(node.value) as Record<string, unknown>;
				if (data) {
					// @ts-ignore
					vFile.data.fm = data;
				}
			} catch (e) {
				vFile.messages.push(new Message("YAML failed to parse", e));
			}
		});
	};
}
