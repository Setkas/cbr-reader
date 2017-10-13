import * as AdmZip from 'adm-zip';
import * as Path from 'path';
import * as Fs from 'fs';
import {Config} from "../config";

export class ArchiveTool {
    private natSort(array: string[]): string[] {
        let a: RegExpMatchArray,
            b: RegExpMatchArray,
            a1: any,
            b1: any,
            rx: RegExp = /(\d+)|(\D+)/g,
            rd: RegExp = /\d+/;

        return array.sort((as: string, bs: string) => {
            a = String(as).toLowerCase().match(rx) || [];

            b = String(bs).toLowerCase().match(rx) || [];

            while (a.length && b.length) {
                a1 = a.shift();

                b1 = b.shift();

                if (rd.test(a1) || rd.test(b1)) {
                    if (!rd.test(a1)) {
                        return 1;
                    }

                    if (!rd.test(b1)) {
                        return -1;
                    }

                    if (a1 != b1) {
                        return a1 - b1;
                    }
                }
                else if (a1 != b1) {
                    return a1 > b1 ? 1 : -1;
                }
            }

            return a.length - b.length;
        });
    }

    constructor() {

    }

    public static GetExtension(fileName: string): string|null {
        return Path.extname(fileName)
    }

    public listArchive(fileName: string): string[]|boolean {
        let extension: string|null = ArchiveTool.GetExtension(fileName) || ".",
            list: string[] = [];

        switch (Config.books.extensions[extension]) {
            case 'zip':
                try {
                    let zip: AdmZip = new AdmZip(Config.books.folder + fileName),
                        entries: AdmZip.IZipEntry[] = zip.getEntries();

                    entries.forEach((entry: AdmZip.IZipEntry) => {
                        if (entry.isDirectory === false) {
                            list.push(entry.entryName);
                        }
                    });
                } catch (e) {
                    console.error("Unable to read archive '" + fileName + "', error: " + JSON.stringify(e));

                    return false;
                }

                break;

            default:
                console.error("Unknown file extension '" + extension + "' detected.");

                return false;
        }

        list = this.natSort(list);

        return list;
    }

    public getArchiveFiles(fileName: string, files: string[]): string[]|boolean {
        let extension: string|null = ArchiveTool.GetExtension(fileName) || ".",
            list: string[] = [];

        switch (Config.books.extensions[extension]) {
            case 'zip':
                try {
                    let zip: AdmZip = new AdmZip(Config.books.folder + fileName),
                        entries: AdmZip.IZipEntry[] = zip.getEntries();

                    entries.forEach((entry: AdmZip.IZipEntry) => {
                        if (files.indexOf(entry.entryName) >= 0) {
                            let baseName: string = Path.basename(fileName, extension || ".") || fileName,
                                filePath: string = Config.books.temp + baseName;

                            zip.extractEntryTo(entry, filePath, true, true);

                            list.push(filePath + "/" + entry.entryName);
                        }
                    });
                } catch (e) {
                    console.error("Unable to read and extract archive '" + fileName + "', error: " + JSON.stringify(e));

                    return false;
                }

                break;

            default:
                console.error("Unknown file extension '" + extension + "' detected.");

                return false;
        }

        return list;
    }
}