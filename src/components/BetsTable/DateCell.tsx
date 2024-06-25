'use client';

export default function DateCell({ createdAt }: { createdAt: Date }) {
	return <td>{new Date(createdAt).toLocaleString()}</td>;
}
