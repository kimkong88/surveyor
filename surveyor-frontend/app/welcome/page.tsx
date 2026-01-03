export default function WelcomePage() {
    return (
        <section aria-labelledby="welcome-title" className="p-4">
            <h1 id="welcome-title">Welcome</h1>
            <p data-testid="permission-guidance">
                Before starting, you may be asked for camera and microphone
                permissions. You can continue without granting them now, and
                enable later when needed.
            </p>
            <button type="button" aria-describedby="welcome-title">
                Start survey
            </button>
        </section>
    );
}
