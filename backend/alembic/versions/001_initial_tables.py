"""Initial tables

Revision ID: 001_initial_tables
Revises:
Create Date: 2025-12-09

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create exercise_types table
    op.create_table('exercise_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('duration_seconds', sa.Integer(), nullable=True),
    sa.Column('instructions', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )

    # Create math_problems table
    op.create_table('math_problems',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('expression', sa.String(length=20), nullable=False),
    sa.Column('answer', sa.Integer(), nullable=False),
    sa.Column('difficulty', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    # Create reading_texts table
    op.create_table('reading_texts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('word_count', sa.Integer(), nullable=True),
    sa.Column('source', sa.String(length=200), nullable=True),
    sa.Column('difficulty', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    # Create word_lists table
    op.create_table('word_lists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category', sa.String(length=50), nullable=True),
    sa.Column('words', postgresql.ARRAY(sa.String()), nullable=False),
    sa.Column('difficulty', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    # Create stroop_colors table
    op.create_table('stroop_colors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('color_name', sa.String(length=20), nullable=False),
    sa.Column('color_code', sa.String(length=7), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    # Create training_sessions table
    op.create_table('training_sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('started_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.Column('completed_at', sa.TIMESTAMP(), nullable=True),
    sa.Column('total_score', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    # Create exercise_results table
    op.create_table('exercise_results',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.Integer(), nullable=True),
    sa.Column('exercise_type', sa.String(length=50), nullable=False),
    sa.Column('started_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.Column('completed_at', sa.TIMESTAMP(), nullable=True),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.Column('time_seconds', sa.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('correct_answers', sa.Integer(), nullable=True),
    sa.Column('total_questions', sa.Integer(), nullable=True),
    sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.ForeignKeyConstraint(['session_id'], ['training_sessions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('exercise_results')
    op.drop_table('training_sessions')
    op.drop_table('stroop_colors')
    op.drop_table('word_lists')
    op.drop_table('reading_texts')
    op.drop_table('math_problems')
    op.drop_table('exercise_types')
