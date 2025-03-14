import React from "react";
import { Button, Spacer, Text } from "@/components/Geist";
import Image from "next/image";
import logo from "@/assets/logo/reacher.svg";
import styles from "./Nav.module.css";
import { Dictionary } from "@/dictionaries";
import { Locale } from "./Locale";
import { SignOut } from "./SignOut";
import { DLink } from "../DLink";
import { User } from "@supabase/supabase-js";

export async function Nav({
	d,
	page,
	user,
}: {
	d: Dictionary;
	page?: "dashboard" | "blog";
	user?: User;
}) {
	return (
		<header className={styles.container}>
			<div>
				<DLink
					d={d}
					className="flex"
					href={user ? "/" : "https://reacher.email"}
				>
					<Image
						alt="Reacher logo"
						height={24}
						src={logo}
						width={24}
					/>
					<Text className={styles.reacher} h3>
						Reacher
						{page == "dashboard" && user && (
							<Text
								className={styles.dashboard}
								span
								type="secondary"
							>
								Dashboard
							</Text>
						)}
						{page == "blog" && (
							<Text
								className={styles.dashboard}
								span
								type="secondary"
							>
								Blog
							</Text>
						)}
					</Text>
				</DLink>
			</div>

			<div className={styles.filler} />

			<div>
				<DLink
					d={d}
					className={styles.link}
					href="/pricing"
					data-sa-link-event="nav_pricing_click"
				>
					{d.nav.pricing}
				</DLink>

				<DLink
					d={d}
					className={styles.link}
					href="/blog/smtp"
					data-sa-link-event="nav_blog_click"
				>
					{d.nav.blog}
				</DLink>

				<a
					className={styles.link}
					href="https://docs.reacher.email"
					target="_blank"
					rel="noopener noreferrer"
					data-sa-link-event="nav_help_click"
				>
					{d.nav.help}
				</a>
				<Locale />
			</div>

			<Spacer w={2} />
			{user ? (
				<SignOut d={d} email={user.email} />
			) : (
				<>
					<DLink d={d} href="/login">
						<Button auto>{d.nav.login}</Button>
					</DLink>
					<Spacer w={0.5} />
					<DLink d={d} href="/signup">
						<Button auto type="success">
							{d.nav.signup}
						</Button>
					</DLink>
				</>
			)}
		</header>
	);
}
