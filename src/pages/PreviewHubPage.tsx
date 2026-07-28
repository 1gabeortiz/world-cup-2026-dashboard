import { Link } from 'react-router-dom';

const previewCards = [
  {
    to: '/groups',
    title: 'Group Stage',
    description: 'Standings by group with qualification highlights.',
  },
  {
    to: '/matches',
    title: 'Matches',
    description: 'Live and upcoming fixtures with filter + sort controls.',
  },
  {
    to: '/bracket',
    title: 'Knockout Bracket',
    description: 'Two-sided bracket layout for elimination rounds.',
  },
  {
    to: '/scorers',
    title: 'Top Scorers',
    description: 'Leaderboard view with player and team details.',
  },
];

export default function PreviewHubPage() {
  return (
    <section className="space-y-4">
      <div className="panel p-5 md:p-6">
        <p className="panel-title">Project Preview</p>
        <h1 className="mt-2 text-2xl font-extrabold text-text-primary md:text-3xl">
          Quick page launcher
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          Use this page to quickly preview every major route before taking screenshots,
          sharing the project, or validating release changes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {previewCards.map((card) => (
          <article key={card.to} className="panel p-4">
            <h2 className="text-lg font-bold text-text-primary">{card.title}</h2>
            <p className="mt-1 text-sm text-text-secondary">{card.description}</p>
            <Link
              to={card.to}
              className="mt-3 inline-flex rounded-md border border-border bg-pitch px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-gold hover:text-gold"
            >
              Open {card.title}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
