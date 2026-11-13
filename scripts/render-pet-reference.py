"""Render only the six reported octave-band values; no invented measurements or smoothing.
Run manually with Python and matplotlib when the reviewed reference data changes.
"""
from pathlib import Path
import json
import argparse
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import FixedLocator, NullLocator
parser = argparse.ArgumentParser()
parser.add_argument('--preview-dir', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'apps/storefront/src/data/pet-reference.json').read_text())
x = [p['frequency'] for p in data['points']]
y = [p['absorption'] for p in data['points']]
plt.rcParams.update({'font.family': 'DejaVu Sans', 'svg.fonttype': 'none', 'svg.hashsalt': 'quietex-pet-reference'})
for mobile in [False, True]:
    fig, ax = plt.subplots(figsize=(6.2, 4.6) if mobile else (12, 4.8), dpi=100)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')
    ax.set_xscale('log', base=2)
    ax.set_xlim(110, 4550)
    ax.set_ylim(-.015, 1.11)
    ax.xaxis.set_major_locator(FixedLocator(x))
    ax.xaxis.set_minor_locator(NullLocator())
    ax.set_xticks(x, ['125', '250', '500', '1k', '2k', '4k'])
    ax.set_yticks([0, .25, .50, .75, 1], ['0.00', '0.25', '0.50', '0.75', '1.00'])
    ax.grid(axis='y', color='#e2e5df', linewidth=1)
    ax.set_axisbelow(True)
    ax.fill_between(x, y, color='#e3ebe1', alpha=.9)
    ax.plot(x, y, color='#344d3a', linewidth=2.8, marker='o', markersize=7, markerfacecolor='#344d3a', markeredgecolor='white', markeredgewidth=1.5)
    for frequency, coefficient in zip(x, y):
        ax.annotate(f'{coefficient:.2f}', (frequency, coefficient), xytext=(0, 12), textcoords='offset points', ha='center', fontsize=11 if mobile else 12, color='#263c2c', weight='medium')
    ax.set_xlabel('Frequency (Hz)', labelpad=14, fontsize=12, color='#495348')
    ax.set_ylabel('Absorption coefficient (αs)', labelpad=12, fontsize=12, color='#495348')
    ax.tick_params(axis='both', labelsize=11, colors='#495348', length=0, pad=9)
    for spine in ax.spines.values():
        spine.set_visible(False)
    fig.subplots_adjust(left=.17 if mobile else .09, right=.96, bottom=.18, top=.94)
    name = 'pet-felt-reference-mobile.svg' if mobile else 'pet-felt-reference.svg'
    fig.savefig(root / 'apps/storefront/public/graphs' / name, metadata={'Date': None, 'Description': data['source'] + '; ' + data['scope']})
    if args.preview_dir:
        args.preview_dir.mkdir(parents=True, exist_ok=True)
        fig.savefig(args.preview_dir / name.replace('.svg', '.png'), dpi=150)
    plt.close(fig)
