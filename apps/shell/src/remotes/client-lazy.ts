import React from "react";

const isServer = typeof window === "undefined";

export function clientLazy<T extends React.ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
	if (isServer) {
		return React.lazy(() =>
			Promise.resolve({ default: (() => null) as unknown as T }),
		);
	}
	return React.lazy(factory);
}
