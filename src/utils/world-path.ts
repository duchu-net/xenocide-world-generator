export const pathPrefix = {
  's:': 'star',
  'p:': 'planet',
  'r:': 'region',
  'm:': 'moon',
  'b:': 'belt',
  'c:': 'construction',
  'a:': 'administration',
  'q:': 'queue',
} as const;

type Pos = { [K in typeof pathPrefix[keyof typeof pathPrefix]]: string };

export const getPathTarget = (path: string): 'galaxy' | 'system' | typeof pathPrefix[keyof typeof pathPrefix] | '' => {
  const groups = path.split('/');
  if (!groups[0]) return '';
  if (groups.length === 1) return 'galaxy';
  if (groups.length === 2) return 'system';
  const lastItem = groups.at(-1) ?? '';
  const prefix = lastItem.split(':').at(0);
  // @ts-ignore
  return pathPrefix[`${prefix}:`] ?? '';
};

export interface WorldPath extends Pos {
  path: string;
  systemPath: string;
  planetPath: string;
  starPath: string;
  galaxy: string;
  system: string;
  target: '' | 'galaxy' | 'system' | typeof pathPrefix[keyof typeof pathPrefix];
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
    const pre = pathPrefix[node.substring(0, 2)]; // todo: allow more letters in pathPrefix
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
