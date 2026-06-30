import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

export interface ColumnConfig {
  key: string;
  label: string;
}

interface ColumnVisibilityModalProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onChange: (visibleColumns: Record<string, boolean>) => void;
}

export const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  open,
  onClose,
  columns,
  visibleColumns,
  onChange,
}) => {
  const handleToggleColumn = (key: string) => {
    const updated = { ...visibleColumns, [key]: !visibleColumns[key] };
    onChange(updated);
  };

  const handleShowAll = () => {
    const updated = { ...visibleColumns };
    columns.forEach(col => {
      updated[col.key] = true;
    });
    onChange(updated);
  };

  const handleHideAll = () => {
    const updated = { ...visibleColumns };
    columns.forEach(col => {
      // Keep at least the 'name' column visible to prevent empty table layout issues
      updated[col.key] = col.key === 'name';
    });
    onChange(updated);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Eye size={20} color="#6366f1" />
        Configure Columns
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Choose which columns you want to display in the database directory.
        </Typography>

        {/* Quick Toggles */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleShowAll}
            startIcon={<Eye size={14} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Show All
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleHideAll}
            startIcon={<EyeOff size={14} />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Hide Others
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Checkbox Grid */}
        <Grid container spacing={1.5}>
          {columns.map(col => (
            <Grid size={{ xs: 6 }} key={col.key}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!visibleColumns[col.key]}
                    onChange={() => handleToggleColumn(col.key)}
                    color="primary"
                    size="small"
                    // Disable unchecking Name so there is always at least one column visible
                    disabled={col.key === 'name' && visibleColumns[col.key]}
                  />
                }
                label={col.label}
                slotProps={{
                  typography: {
                    variant: 'body2',
                    sx: { fontWeight: 550, color: 'text.primary' },
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
