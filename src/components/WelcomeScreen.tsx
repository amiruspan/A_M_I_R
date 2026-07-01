type WelcomeScreenProps = {
  onStart: () => void;
};

const highlights = [
  {
    title: 'Играй в викторины',
    text: 'Выбирай готовую викторину или вводи код от друга, чтобы сразу начать игру.',
  },
  {
    title: 'Создавай свои вопросы',
    text: 'Собери собственную викторину, поделись кодом и устрой мини-соревнование.',
  },
  {
    title: 'Зарабатывай coins',
    text: 'За правильные ответы ты получаешь coins и можешь открывать скины и рамки.',
  },
];

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <main className="welcome-screen">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <p className="eyebrow">QuizRoom</p>
          <h1>Викторина, где ты отвечаешь, создаешь и прокачиваешь профиль</h1>
          <p className="welcome-text">
            Это игра с короткими вопросами. Отвечай правильно, набирай очки,
            получай coins и открывай новые украшения для своего профиля.
          </p>
          <button onClick={onStart} type="button">Начать</button>
        </div>

        <div className="welcome-steps" aria-label="Что можно делать в игре">
          {highlights.map((item, index) => (
            <article className="welcome-step" key={item.title}>
              <span>{index + 1}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
