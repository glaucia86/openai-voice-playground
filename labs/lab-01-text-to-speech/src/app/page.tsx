const TUTORIAL_URL =
  "https://github.com/glaucia86/openai-voice-playground/blob/main/labs/lab-01-text-to-speech/tutorial/tutorial.md";

export default function HomePage() {
  return (
    <main>
      <p className="eyebrow">OpenAI Voice Playground · Lab 01</p>
      <h1>Starter pronto. Agora você vai construir o Text to Speech.</h1>
      <p>
        A configuração mínima já executa. O contrato, a rota segura, o streaming, a interface e
        os testes serão adicionados por você durante o workshop.
      </p>
      <p lang="en">
        The minimal setup already runs. You will add the contract, secure route, streaming,
        interface, and tests as you follow the workshop.
      </p>
      <a href={TUTORIAL_URL}>Abrir o tutorial passo a passo / Open the step-by-step tutorial</a>
    </main>
  );
}
