<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/problems';

  // issues: problem → where its own ticket lives.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Problem, string>> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const channels = (c: Record<string, number>) =>
    Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([ch, n]) => `${ch} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{split.total}</strong> reports in #{ticket} ·
  <strong>{split.groups.length}</strong> problems
  {#if split.exportRows !== split.total}
    <span class="note">({split.exportRows} rows in the export; {split.exportRows - split.total} came twice)</span>
  {/if}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>came in by</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports}{#if g.alsoIn}<span class="note"> (also in <code>{g.alsoIn}</code>)</span>{/if}</td>
        <td>{g.tenants.length}</td>
        <td class="ch">{channels(g.channels)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if issues[g.problem]}<a href={issues[g.problem]}>{issues[g.problem]?.replace(/^https:\/\/github\.com\//, '').replace('/issues/', '#')}</a>{:else}none{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.groups.filter((g) => g.alsoIn) as g (g.problem)}
  <p class="note">{g.reports} <code>{g.problem}</code> reports are counted under <code>{g.alsoIn}</code> too, where the desk files them by tenant.</p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note, .ch { color: var(--muted); font-size: 0.85em; }
</style>
