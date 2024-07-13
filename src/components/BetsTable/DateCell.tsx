'use client';

import { memo, useEffect, useState } from 'react';

function DateCell({ createdAt }: { createdAt: Date }) {
	const [date, setDate] = useState<Date | null>(null);

	useEffect(() => {
		setDate(createdAt);
	}, [createdAt]);

	return <td>{date?.toLocaleString()}</td>;
}

export default memo(DateCell);
