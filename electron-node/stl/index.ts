import { odd2Stl } from "./odd";
import { template2Stl } from "./template";

export async function generateStl(_e: any, odd: string, template: string) {
  const oddStls = odd2Stl(odd);
  let stl =
    "# ODD\n" +  
    oddStls[0].filter((i) => i).join("\n") +
    oddStls[1].filter((i) => i).join("\n");
  const templateStls = template2Stl(template);
  stl += "\n# Specification\n" + templateStls.filter((i) => i).join("\n");
  return stl;
}

export async function generatePstl(_e: any, odd: string, template: string) {}
