"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getSkills } from "@/services/skill.service";
import { getProfile, updateProfile } from "@/services/user.service";
import type { Skill } from "@/types/api";

export default function SkillsPage() {
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [initialSkills, setInitialSkills] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getSkills(), getProfile()])
      .then(([availableSkills, profile]) => {
        if (!active) return;
        setCatalog(availableSkills);
        setSkills(profile.skills || []);
        setInitialSkills(profile.skills || []);
      })
      .catch(() => {
        if (active) setError("Your skills could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isDirty = skills.join("\u0000") !== initialSkills.join("\u0000");
  const filteredCatalog = useMemo(() => catalog.filter((skill) =>
    skill.name.toLowerCase().includes(query.trim().toLowerCase()) && !skills.includes(skill.name)
  ), [catalog, query, skills]);
  const categories = useMemo(() => [...new Set(filteredCatalog.map((skill) => skill.category || "Other"))], [filteredCatalog]);

  const addSkill = (name: string) => {
    const normalized = name.trim();
    if (!normalized || skills.some((skill) => skill.toLowerCase() === normalized.toLowerCase())) return;
    setSkills((current) => [...current, normalized]);
    setCustomSkill("");
  };

  const addCustomSkill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addSkill(customSkill);
  };

  const saveSkills = async () => {
    setSaving(true);
    setError("");
    try {
      const saved = await updateProfile({ skills });
      setSkills(saved.skills || skills);
      setInitialSkills(saved.skills || skills);
    } catch {
      setError("Your skill list could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="page-heading-row">
        <Box>
          <Typography className="page-eyebrow">YOUR TOOLKIT</Typography>
          <Typography variant="h1" className="page-title">Skills</Typography>
          <Typography className="page-subtitle">Keep your professional profile current as your capabilities grow.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={() => document.getElementById("skill-search")?.focus()}>
          Explore skills
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}

      <Box className="skills-layout">
        <Box className="skills-primary-column">
          <Paper className="skills-current-panel" elevation={0}>
            <Box className="section-heading-row">
              <Box>
                <Typography className="impact-overview-label">PROFILE SKILLS</Typography>
                <Typography variant="h2" className="section-title">Your toolkit</Typography>
              </Box>
              <span className="skills-total">{skills.length.toString().padStart(2, "0")}</span>
            </Box>
            {loading ? (
              <Box className="loading-state"><CircularProgress size={24} /></Box>
            ) : skills.length === 0 ? (
              <Box className="skills-empty">
                <Typography>No skills added yet</Typography>
                <Typography variant="body2" color="text.secondary">Add the skills you use today. You can update this list whenever your work changes.</Typography>
              </Box>
            ) : (
              <Box className="skill-chip-list">
                {skills.map((skill) => <Chip key={skill} label={skill} onDelete={() => setSkills((current) => current.filter((item) => item !== skill))} />)}
              </Box>
            )}
            <Box component="form" onSubmit={addCustomSkill} className="custom-skill-form">
              <TextField label="Add a skill" placeholder="e.g. Product strategy" value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} size="small" fullWidth />
              <Button type="submit" variant="outlined" startIcon={<AddRoundedIcon />} disabled={!customSkill.trim()}>Add</Button>
            </Box>
            <Box className="skills-save-row">
              <Typography variant="body2" color="text.secondary">Changes are saved to your career profile.</Typography>
              <Button variant="contained" onClick={() => void saveSkills()} disabled={!isDirty || saving}>
                {saving ? <CircularProgress size={18} color="inherit" /> : "Save changes"}
              </Button>
            </Box>
          </Paper>
        </Box>

        <Paper className="skills-catalog-panel" elevation={0}>
          <Typography className="impact-overview-label">SKILL LIBRARY</Typography>
          <Typography variant="h2" className="section-title">Find your next skill</Typography>
          <TextField
            id="skill-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the library"
            size="small"
            fullWidth
            slotProps={{ input: { startAdornment: <SearchRoundedIcon color="action" sx={{ mr: 1 }} /> } }}
            sx={{ mt: 2, mb: 2.5 }}
          />
          {loading ? <Box className="loading-state"><CircularProgress size={24} /></Box> : categories.length === 0 ? (
            <Typography className="catalog-empty" variant="body2">{catalog.length ? "No matching skills. Add it using the field on the left." : "The skill library is empty right now. Add a skill directly to your profile."}</Typography>
          ) : (
            <Stack spacing={2.5}>
              {categories.map((category) => (
                <Box key={category}>
                  <Typography className="skill-category-label">{category}</Typography>
                  <Stack spacing={0.5}>
                    {filteredCatalog.filter((skill) => (skill.category || "Other") === category).map((skill) => (
                      <Button key={skill._id} className="catalog-skill-row" onClick={() => addSkill(skill.name)} endIcon={<AddRoundedIcon />}>
                        <span>{skill.name}</span>
                      </Button>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Stack>
  );
}