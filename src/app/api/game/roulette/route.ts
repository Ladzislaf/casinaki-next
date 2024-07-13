import playRouletteAction from '@/actions/playRouletteAction';

export async function POST(request: Request) {
	// TODO validation
	const req = await request.json();

	if (req.playerEmail && req.bet) {
		await playRouletteAction({
			playerEmail: req.playerEmail,
			bet: req.bet,
			isWon: req.isWon,
			isZeroBet: req.isZeroBet,
		});
	}

	return Response.json(req);
}
