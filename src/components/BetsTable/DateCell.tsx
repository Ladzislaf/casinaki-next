'use client';

import { memo } from 'react';

function DateCell({ createdAt }: { createdAt: Date }) {
	const date = new Date(createdAt).toLocaleString();
	return <td>{date}</td>;
}

export default memo(DateCell);
