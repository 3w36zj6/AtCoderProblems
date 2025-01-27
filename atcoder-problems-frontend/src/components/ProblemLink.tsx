import React, { useState } from "react";
import { Tooltip } from "reactstrap";
import * as Url from "../utils/Url";
import { getRatingColorClass } from "../utils";
import ProblemModel from "../interfaces/ProblemModel";
import { RatingInfo } from "../utils/RatingInfo";
import { DifficultyCircle } from "./DifficultyCircle";
import { NewTabLink } from "./NewTabLink";

interface Props {
  className?: string;
  problemId: string;
  contestId: string;
  problemIndex?: string;
  problemName: string;
  showDifficulty?: boolean;
  isExperimentalDifficulty?: boolean;
  showDifficultyUnavailable?: boolean;
  problemModel?: ProblemModel | null;
  userRatingInfo?: RatingInfo | null;
}

export const ProblemLink: React.FC<Props> = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    contestId,
    problemId,
    problemIndex,
    problemName,
    showDifficulty,
    isExperimentalDifficulty,
    showDifficultyUnavailable,
    problemModel,
    userRatingInfo,
  } = props;
  const problemTitle = problemIndex
    ? `${problemIndex}. ${problemName}`
    : problemName;

  const link = (
    <NewTabLink
      href={Url.formatProblemUrl(problemId, contestId)}
      className={props.className}
    >
      {problemTitle}
    </NewTabLink>
  );

  const difficulty = problemModel?.difficulty;
  if (
    !showDifficulty ||
    problemModel === undefined ||
    (difficulty === undefined && !showDifficultyUnavailable) ||
    /^ahc\d{3}$/g.test(contestId)
  ) {
    return link;
  }

  const uniqueId = problemId + "-" + contestId;
  const experimentalIconId = "experimental-" + uniqueId;
  const ratingColorClass =
    difficulty === undefined ? undefined : getRatingColorClass(difficulty);

  return (
    <>
      <DifficultyCircle
        id={uniqueId}
        problemModel={problemModel}
        userRatingInfo={userRatingInfo}
      />
      {isExperimentalDifficulty ? (
        <>
          <span id={experimentalIconId} role="img" aria-label="experimental">
            🧪
          </span>
          <Tooltip
            placement="top"
            target={experimentalIconId}
            isOpen={tooltipOpen}
            toggle={(): void => setTooltipOpen(!tooltipOpen)}
          >
            This estimate is experimental.
          </Tooltip>
        </>
      ) : null}
      {
        // Don't add rel="noreferrer" to AtCoder links
        // to allow AtCoder get the referral information.
        // eslint-disable-next-line react/jsx-no-target-blank
        <a
          href={Url.formatProblemUrl(problemId, contestId)}
          // Don't add rel="noreferrer" to AtCoder links
          // to allow AtCoder get the referral information.
          // eslint-disable-next-line react/jsx-no-target-blank
          target="_blank"
          rel="noopener"
          className={ratingColorClass}
        >
          {problemTitle}
        </a>
      }
    </>
  );
};
