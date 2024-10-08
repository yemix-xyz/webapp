import { addMonths } from "date-fns";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";

import { generateLicense } from "../src/util/license";

async function main(): Promise<void> {
	const myArgs = process.argv.slice(2);

	if (myArgs.length < 2 || myArgs.length > 3) {
		console.error(
			"Usage: yarn gen:license [name] [email] [address] [optional_start_date]"
		);
		process.exit(1);
	}

	const startDate = myArgs[3] ? new Date(myArgs[3]) : new Date();

	// Generate with dummy data.
	const pdf = await generateLicense({
		backend_version: "0.7.x",
		ciee_version: "0.8.x | 0.9.x",
		license_end_date: addMonths(startDate, 1),
		number_devs: 25,
		stripe_buy_date: startDate,
		stripe_buyer_name: myArgs[0],
		stripe_buyer_email: myArgs[1],
		stripe_buyer_address: myArgs[2],
	});

	const path = `${tmpdir()}/${pdf.filename}`;
	await writeFile(path, pdf.data);

	console.log(path);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
