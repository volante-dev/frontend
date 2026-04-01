"use client";

import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { forwardRef } from "react";

export interface ProjectCardProps extends Omit<MuiCardProps, "title"> {
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ title, description, imageUrl, tags = [], ...props }, ref) => (
    <MuiCard ref={ref} {...props}>
      {imageUrl && <CardMedia component="img" height={240} image={imageUrl} alt={title} />}
      <CardContent sx={{ p: 3 }}>
        {tags.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            {tags.map((tag) => (
              <Typography
                key={tag}
                variant="subtitle2"
                component="span"
                sx={{ fontSize: "0.7rem" }}
              >
                {tag}
              </Typography>
            ))}
          </Box>
        )}
        <Typography variant="h5" component="h3" gutterBottom>
          {title}
        </Typography>
        {description && <Typography variant="body2">{description}</Typography>}
      </CardContent>
    </MuiCard>
  ),
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
