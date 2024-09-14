export declare const pathPrefix: {
    readonly 's:': "star";
    readonly 'p:': "planet";
    readonly 'r:': "region";
    readonly 'm:': "moon";
    readonly 'b:': "belt";
    readonly 'c:': "construction";
    readonly 'a:': "administration";
    readonly 'q:': "queue";
    readonly 'o:': "orbital";
};
type Pos = {
    [K in typeof pathPrefix[keyof typeof pathPrefix]]: string;
};
export declare const getPathTarget: (path: string) => "galaxy" | "system" | (typeof pathPrefix)[keyof typeof pathPrefix] | "";
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
export declare const parseWorldPath: (path?: string) => WorldPath;
export {};
