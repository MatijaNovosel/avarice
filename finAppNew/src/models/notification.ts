export class Alert {
  private _timestamp: number = new Date().getTime();

  get timestamp(): number {
    return this._timestamp;
  }

  constructor(
    public message: string, 
    public timeout: number = 5000, 
    public autoclose: boolean = false, 
    public border: string = "top", 
    public coloredBorder: boolean = false, 
    public dark: boolean = false, 
    public dense: boolean = false, 
    public dismissible: boolean = true, 
    public light: boolean = false, 
    public outlined: boolean = false, 
    public prominent: boolean = false, 
    public coloredTextBorder: boolean = false, 
    public tile: boolean = false, 
    public type: string = "success",
    public maxWidth: number = 900,
    public side: boolean = false) {
    this.message = message;
    this.autoclose = autoclose;
    this.border = border;
    this.coloredBorder = coloredBorder;
    this.dark = dark;
    this.dense = dense;
    this.dismissible = dismissible;
    this.light = light;
    this.outlined = outlined;
    this.prominent = prominent;
    this.coloredTextBorder = coloredTextBorder;
    this.tile = tile;
    this.type = type;
    this.maxWidth = maxWidth;
    this.side = side;
  } 
}

export class Snackbar {
  private _timestamp: number = new Date().getTime();

  get timestamp(): number {
    return this._timestamp;
  }
    
  constructor(
    public message: string,     
    public timeout: number = 5000, 
    public autoclose: boolean = false, 
    public absolute: boolean = false,
    public top: boolean = false,
    public right: boolean = false,
    public bottom: boolean = false,
    public left: boolean = false,
    public multi: boolean = false,
    public vertical: boolean = false,
    public color: string = 'success',
    public app: boolean = true,
    public value: boolean = true) {
    this.message = message;
    this.value = value;
    this.autoclose = autoclose;
    this.absolute = absolute;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.multi = multi;
    this.vertical = vertical;
    this.color = color;
    this.app = app;    
    this.timeout = timeout;
  }    
}
