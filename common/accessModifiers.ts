export abstract class AccessModifiers {
    private _private: Boolean = false;
    isPrivate(): Boolean {
        return this._private;
    }
    setPrivate(): void {
        this._private = true;
    }
    isPublic(): Boolean {
        return !this._private;
    }
    setPublic(): void {
        this._private = false;
    }
}