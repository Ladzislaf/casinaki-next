'use server';
import prisma from '@/utils/prisma';
import {kv} from '@vercel/kv';
import {updatePlayerBalance} from './dataActions';

export async function activatePromo(playerEmail: string, promo: string) {
	try {
		const player = await prisma.player.findUnique({
			where: {email: playerEmail},
		});
		if (!player) {
			console.error(`[ActivatePromo] player ${playerEmail} not found`);
			return {message: 'Server error: player not found.'};
		}
		const promocode = await prisma.promocode.findUnique({where: {code: promo}});
		if (!promocode) return {message: `Promocode ${promo} not found.`};
		const activatedPromo = await prisma.activatedPromocode.findFirst({
			where: {playerEmail: playerEmail, promocodeId: promocode.id},
		});
		if (activatedPromo) return {message: `You've already activated promocode ${promo}.`};
		await prisma.promocode.update({
			where: {
				id: promocode.id,
			},
			data: {
				count: promocode.count - 1,
			},
		});
		await prisma.activatedPromocode.create({
			data: {
				playerEmail: playerEmail,
				promocodeId: promocode.id,
			},
		});
		const newBalance = player.balance + promocode.value;
		updatePlayerBalance(playerEmail, newBalance);
		return {newBalance, message: 'Success!'};
	} catch (error) {
		console.error('[ActivatePromo Error]', error);
	}
}

export async function activateDailyBonus(playerEmail: string) {
	try {
		if (await kv.get(`bonusCache:${playerEmail}`)) {
			return {message: `You've already activated the bonus today.`};
		}
		const player = await prisma.player.findUnique({
			where: {email: playerEmail},
		});
		if (!player) {
			console.error(`[ActivateDailyBonus] player ${playerEmail} not found`);
			return {message: 'Server error: player not found.'};
		}
		if (player.bonus?.toDateString() === new Date().toDateString()) {
			await kv.setex(`bonusCache:${playerEmail}`, 180, true);
			return {message: 'You have already activated the bonus today.'};
		} else {
			await prisma.player.update({
				where: {
					email: playerEmail,
				},
				data: {
					bonus: new Date(),
				},
			});
			const newBalance = player.balance + 1;
			await updatePlayerBalance(playerEmail, newBalance);
			return {newBalance, message: 'Success!'};
		}
	} catch (error) {
		console.error('[ActivateDailyBonus Error]', error);
	}
}
