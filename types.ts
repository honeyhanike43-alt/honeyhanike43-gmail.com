export enum Quadrant {
  AzureDragon = "The Azure Dragon of the East (东方青龙)",
  BlackTortoise = "The Black Tortoise of the North (北方玄武)",
  WhiteTiger = "The White Tiger of the West (西方白虎)",
  VermilionBird = "The Vermilion Bird of the South (南方朱雀)"
}

export interface Constellation {
  id: number;
  quadrant: Quadrant;
  chineseName: string;
  arcanaName: string;
  theme: string;
  imageDescription: string; // Description for AI image generation
  element?: string; 
  animal?: string;
}