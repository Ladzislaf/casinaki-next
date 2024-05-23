import prisma from './prisma';

export async function fetchRanks() {
	try {
		return prisma.rank.findMany();
	} catch (error) {
		console.error('[FetchRanks Error]', error);
	}
}
