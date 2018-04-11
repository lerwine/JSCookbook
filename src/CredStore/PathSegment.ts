namespace CredStore {
    interface IMetaData { [key: string]: any };
    interface IPathSegment {
        name: string;
        authority?: number;
        defaultCredential?: number;
        segments?: PathSegment[];
        metaData?: IMetaData;
    }
    export class PathSegment implements IPathSegment {
        name: string = "";
        authority?: number;
        defaultCredential?: number;
        segments: PathSegment[] = [ ];
        metaData: IMetaData = { };
        toJSON(): IPathSegment {
            let authority: number|undefined;
            let defaultCredential: number|undefined;
            let metaData: IMetaData|undefined;
            let segments: PathSegment[]|undefined;
            if (typeof(this.authority) == "number" && !isNaN(this.authority))
                authority = this.authority;
            if (typeof(this.defaultCredential) == "number" && !isNaN(this.defaultCredential))
                defaultCredential = this.defaultCredential;
            if (typeof(this.metaData) == "object" && this.metaData !== null)
                metaData = this.metaData;
            if (typeof(this.segments) == "object" && this.segments !== null && Array.isArray(segments))
                segments = this.segments.filter(i => typeof(i) == "object" && i !== null && i instanceof PathSegment);
                
            return {
                name: (typeof(this.name) == "string") ? this.name : "",
                authority: authority,
                segments: segments,
                defaultCredential: defaultCredential
            }
        }
    }
}