import React from "react";
import { Text } from "@geist-ui/react";
import { ProductCard } from "./ProductCard";
import type { ProductCardProps } from "./ProductCard";

export function SaaS100k(props: ProductCardProps): React.ReactElement {
	return (
		<ProductCard
			{...props}
			features={features}
			header={
				<Text b small type="warning">
					✨ New ✨
				</Text>
			}
			subtitle={<span>100,000 email verifications / mo</span>}
		/>
	);
}

const features = [
	"Use Reacher's servers with high IP reputation.",
	<span key="saasFeatures-2">
		<a
			href="https://help.reacher.email/email-attributes-inside-json"
			target="_blank"
			rel="noopener noreferrer"
		>
			Full-featured
		</a>{" "}
		email verifications.
	</span>,
	<span key="customer-support">
		<strong>Customer support</strong> via email/chat.
	</span>,
	"Cancel anytime.",
];
