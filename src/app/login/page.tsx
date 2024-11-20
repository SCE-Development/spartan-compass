export default async function Page() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<h1>Sign in</h1>
				<a href="/login/google" className="inline-flex items-center justify-center">Sign in with Google</a>
			</div>
		</div>
	);
}