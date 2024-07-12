import playRouletteAction from '@/actions/playRouletteAction';

export async function POST(request: Request) {
	// TODO validation
	const res = await request.json();

	if (res.playerEmail && res.bet && res.isWon && res.isZeroBet) {
		await playRouletteAction({
			playerEmail: res.playerEmail,
			bet: res.bet,
			isWon: res.isWon,
			isZeroBet: res.isZeroBet,
		});
	}

	return Response.json(res);
}
