const prefix = {
  's:': 'star',
  'p:': 'planet',
  'r:': 'region',
  'm:': 'moon',
  'b:': 'belt',
  'c:': 'construction',
} as const;

type Pos = { [K in typeof prefix[keyof typeof prefix]]: string };

export interface WorldPath extends Pos {
  path: string;
  systemPath: string;
  planetPath: string;
  starPath: string;
  galaxy: string;
  system: string;
  target: '' | 'galaxy' | 'system' | typeof prefix[keyof typeof prefix];
  groups: WorldPath['target'][];
}

export const parseWorldPath = (path = '') => {
  const [galaxy, system, ...nodes] = path.split('/');
  const position: WorldPath = {
    path,
    galaxy,
    system,
    systemPath: galaxy && system ? `${galaxy}/${system}` : '',
    star: '',
    planet: '',
    region: '',
    moon: '',
    belt: '',
    construction: '',
    target: system ? 'system' : galaxy ? 'galaxy' : '',
    // @ts-ignore
    groups: [galaxy && 'galaxy', system && 'system'].filter(Boolean),
  };
  nodes.forEach((node, index) => {
    // @ts-ignore
    const pre = prefix[node.substring(0, 2)]; // todo: allow more letters in prefix
    if (pre) {
      position.groups.push(pre);
      // @ts-ignore
      position[pre] = node.substring(2, node.length);
    }
    if (index === nodes.length - 1) position.target = pre;
  });

  position.starPath = position.target === 'star' ? path : '';
  position.planetPath = position.target === 'planet' ? path : '';

  return position;
};
