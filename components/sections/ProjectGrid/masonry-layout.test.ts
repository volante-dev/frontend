import { describe, expect, it } from "vitest";
import {
  getDesktopMasonryPlacements,
  type MasonryLayoutItem,
} from "./masonry-layout";

const item = (
  id: string,
  portfolioSize: MasonryLayoutItem["portfolioSize"] = "NORMAL",
): MasonryLayoutItem => ({ id, portfolioSize });

describe("getDesktopMasonryPlacements", () => {
  it("alternates heroes and fills the opposite block from mobile order", () => {
    const placements = getDesktopMasonryPlacements([
      item("X1", "HERO"),
      item("Y1"),
      item("Y2"),
      item("Y3"),
      item("Y4"),
      item("X2", "HERO"),
      item("Y5"),
      item("Y6"),
      item("Y7"),
    ]);

    expect(placements.get("X1")).toMatchObject({ columnStart: 1, rowStart: 1 });
    expect(placements.get("Y4")).toMatchObject({ columnStart: 4, rowStart: 2 });
    expect(placements.get("X2")).toMatchObject({ columnStart: 3, rowStart: 3 });
    expect(placements.get("Y5")).toMatchObject({ columnStart: 1, rowStart: 3 });
    expect(placements.get("Y7")).toMatchObject({ columnStart: 1, rowStart: 4 });
  });

  it("leaves unused cells empty in an incomplete hero band", () => {
    const placements = getDesktopMasonryPlacements([
      item("X1", "HERO"),
      item("Y1"),
    ]);

    expect(placements.get("X1")).toEqual({
      columnStart: 1,
      rowStart: 1,
      columnSpan: 2,
      rowSpan: 2,
    });
    expect(placements.get("Y1")).toMatchObject({ columnStart: 3, rowStart: 1 });
  });

  it("gives consecutive heroes separate alternating bands", () => {
    const placements = getDesktopMasonryPlacements([
      item("X1", "HERO"),
      item("X2", "HERO"),
    ]);

    expect(placements.get("X1")).toMatchObject({ columnStart: 1, rowStart: 1 });
    expect(placements.get("X2")).toMatchObject({ columnStart: 3, rowStart: 3 });
  });

  it("lays out leading and overflow normal items on full rows", () => {
    const placements = getDesktopMasonryPlacements([
      item("A"),
      item("B"),
      item("X1", "HERO"),
      item("C"),
      item("D"),
      item("E"),
      item("F"),
      item("G"),
      item("X2", "HERO"),
    ]);

    expect(placements.get("A")).toMatchObject({ columnStart: 1, rowStart: 1 });
    expect(placements.get("X1")).toMatchObject({ columnStart: 1, rowStart: 2 });
    expect(placements.get("G")).toMatchObject({ columnStart: 1, rowStart: 4 });
    expect(placements.get("X2")).toMatchObject({ columnStart: 3, rowStart: 5 });
  });
});
