import { CheckEmailOutput } from "@reacherhq/api";
import { supabaseAdmin } from "@/supabase/supabaseAdmin";
import { NextRequest } from "next/server";
import { removeSensitiveData } from "@/app/api/v0/check_email/checkUserInDb";

export interface WebhookExtra {
	bulkEmailId: number;
	userId: string;
	endpoint: string;
}

export interface WebhookPayload {
	output: CheckEmailOutput;
	extra: WebhookExtra;
}

export const POST = async (req: NextRequest): Promise<Response> => {
	if (req.headers.get("x-reacher-secret") !== process.env.RCH_HEADER_SECRET) {
		return Response.json({ error: "Invalid header secret" });
	}

	const body: WebhookPayload = await req.json();
	const { output, extra } = body;

	// Add to supabase calls
	const res1 = await supabaseAdmin
		.from("calls")
		.insert({
			endpoint: extra.endpoint,
			user_id: extra.userId,
			backend: output.debug?.server_name,
			domain: output.syntax.domain,
			duration: Math.round(
				(output.debug?.duration.secs || 0) * 1000 +
					(output.debug?.duration.nanos || 0) / 1000000
			),
			is_reachable: output.is_reachable,
			verif_method: output.debug?.smtp?.verif_method?.type,
			result: removeSensitiveData(output),
			bulk_email_id: extra.bulkEmailId,
		})
		.select("*");
	if (res1.error) {
		return Response.json(res1.error, res1);
	}

	return Response.json({ ok: true }, { status: 200 });
};
