import db from "@/db";
export const getUserTierDetails = async (email: string) => {
	const tier = await db.user.findFirst({
		where: { email },
		include: { billing: true },
	});
	return tier?.billing;
};
