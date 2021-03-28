export default class NavigationLink {
  constructor(public text: string, public route: any, public sublinks?: Array<NavigationLink>, public icon?: string, public can?: boolean) {
    this.icon = icon;
    this.text = text;
    this.can = can;
    this.route = route;
    this.sublinks = sublinks
  }
}
